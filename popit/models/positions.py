import datetime

from django.contrib.gis.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.core import exceptions
from django.db.models import Q
from django.conf import settings

from django_date_extensions.fields import ApproximateDateField
from markitup.fields import MarkupField

from popit.models import ModelBase, date_help_text, Person, Organisation, DataKey, Data

class PositionCategory(ModelBase):
    #category_choices = (
    #    ('political', 'Political'),
    #    ('education', 'Education (as a learner)'),
    #    ('other',     'Anything else'),
    #)
    category = models.CharField(max_length=100)

    class Meta:
        ordering = [ 'category' ]
        app_label = 'popit'

    def __unicode__(self):
        return self.category

class PositionType(ModelBase):
    name            = models.CharField(max_length=100)
    slug            = models.SlugField()
    summary         = MarkupField(blank=True, default='')
    requires_place  = models.BooleanField(default=False, help_text="Does this job type require a place to complete the position?")
    organisation    = models.ForeignKey(Organisation, null=True, blank=True)
    category        = models.ForeignKey(PositionCategory, null=True, blank=True, help_text="What sort of position is this?")

    class Meta:
        ordering = [ "name" ]
        app_label = 'popit'

    def __unicode__(self):
        if self.organisation:
            return u'%s (%s)' % (self.name, self.organisation)
        return self.name
    
#    @models.permalink
#    def get_absolute_url(self):
#        return ( 'position', [ self.slug ] )
#
#    def organisations(self):
#        """
#        Return a qs of organisations, with the most frequently related first.
#
#        Each organisation is also annotated with 'position_count' which might be
#        useful.
#
#        This is intended as an alternative to assigning a org to each
#        position_title. Instead we can deduce it from the postions.
#        """
#
#        orgs = (
#            Organisation
#                .objects
#                .filter(position__title=self)
#                .annotate( position_count=models.Count('position') )
#                .order_by( '-position_count' )
#        )
#
#        return orgs

class Position(ModelBase):
    person          = models.ForeignKey(Person)
    organisation    = models.ForeignKey(Organisation, null=True, blank=True)

    type            = models.ForeignKey(PositionType, null=True, blank=True)
    title           = models.CharField(max_length=200, blank=True, default='')

    # XXX: Working with South here presumably, umm, tricky
    if 'mapit' in settings.INSTALLED_APPS:
        place       = models.ForeignKey('Place', null=True, blank=True, help_text="use if needed to identify the position - eg add constituency for an 'MP'" )
    else:
        place       = models.CharField(max_length=100, blank=True, help_text="use if needed to identify the position - eg add constituency for an 'MP'")

    note            = models.CharField(max_length=300, blank=True, default='')

    start_date      = ApproximateDateField(blank=True, help_text=date_help_text)
    end_date        = ApproximateDateField(blank=True, help_text=date_help_text, default="future")

    # Two hidden fields that are only used to do sorting. Filled in by code.
    sorting_start_date      = models.CharField(editable=True, default='', max_length=10)
    sorting_end_date        = models.CharField(editable=True, default='', max_length=10)

    def __unicode__(self):
        if self.organisation:
            organisation = self.organisation.name
        elif self.type and self.type.organisation:
            organisation = self.type.organisation.name
        else:
            organisation = 'Unknown'
        if self.title and self.type:
            title = u'%s (%s)' % (self.title, self.type)
        elif self.type:
            title = self.type
        else:
            title = self.title or 'Unknown'
        if self.place:
            place = '(%s)' % self.place
        else:
            place = ''
        out = "%s's position as %s %s at %s (%s-%s)" % ( self.person.name, title, self.place, organisation, self.start_date, self.end_date)
        return out

    class Meta:
        app_label = 'popit'
        ordering = ['-sorting_end_date', '-sorting_start_date']  
    
    def clean(self):
        if not (self.organisation or self.title or self.type):
            raise exceptions.ValidationError('Must have at least one of organisation, title or type.')

        if self.type and self.type.requires_place and not self.place:
            raise exceptions.ValidationError( "The job type '%s' requires a place to be set" % self.type.name )


    def display_dates(self):
        """Nice HTML for the display of dates"""

        # no dates
        if not (self.start_date or self.end_date):
            return ''

        # start but no end
        if self.start_date and not self.end_date:
            return "Started %s" % self.start_date

        # both dates
        if self.start_date and self.end_date:
            if self.end_date.future:
                return "Started %s" % ( self.start_date )
            else:
                return "%s &rarr; %s" % ( self.start_date, self.end_date )
        
        # end but no start
        if not self.start_date and self.end_date:
            return 'ongoing'

    def display_start_date(self):
        """Return text that represents the start date"""
        if self.start_date:
            return str(self.start_date)
        return '?'
    
    def display_end_date(self):
        """Return text that represents the end date"""
        if self.end_date:
            return str(self.end_date)
        return '?'

    def is_ongoing(self):
        """Return True or False for whether the position is currently ongoing"""
        if not self.end_date:
            return False
        elif self.end_date.future:
            return True
        else:
            # turn today's date into an ApproximateDate object and cmp to that
            now = datetime.date.today()
            now_approx = ApproximateDate(year=now.year, month=now.month, day=now.day )
            return now_approx <= self.end_date

    def has_known_dates(self):
        """Is there at least one known (not future) date?"""
        return (self.start_date and not self.start_date.future) or (self.end_date and not self.end_date.future)
    

    def _set_sorting_dates(self):
        """Set the sorting dates from the actual dates (does not call save())"""
        # value can be yyyy-mm-dd, future or None
        start = repr( self.start_date ) if self.start_date else ''
        end   = repr( self.end_date   ) if self.end_date   else ''
        
        # set the value or default to something sane
        sorting_start_date =        start or '0000-00-00'
        sorting_end_date   = end or start or '0000-00-00'
        
        # To make the sorting consistent special case some parts
        if not end and start == 'future':
            sorting_start_date = 'a-future' # come after 'future'
        
        self.sorting_start_date = sorting_start_date
        self.sorting_end_date   = sorting_end_date
        
        return True

    def save(self, *args, **kwargs):
        self._set_sorting_dates()
        super(Position, self).save(*args, **kwargs)

class PositionDataKey(DataKey):
    class Meta:
        app_label = 'popit'

class PositionData(Data):
    person = models.ForeignKey(Position, related_name='data')
    key = models.ForeignKey(PositionDataKey, related_name='values')
    class Meta:
        app_label = 'popit'
        verbose_name_plural = 'position data'



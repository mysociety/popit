from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.contrib.gis.db import models

from django_date_extensions.fields import ApproximateDateField
from markitup.fields import MarkupField

from popit.models import ModelBase, DataKey, Data, date_help_text, CodeType

class Organisation(ModelBase):
    slug    = models.SlugField(editable=False)
    summary = MarkupField(blank=True, default='')
    started = ApproximateDateField(blank=True, help_text=date_help_text)
    ended   = ApproximateDateField(blank=True, help_text=date_help_text)

    class Meta:
        ordering = [ 'slug' ]
        app_label = 'popit'

    def __unicode__(self):
        return self.name

    @property
    def name(self):
        try:
            return self.names.all()[0]
        except:
            return 'Unknown'

    #@models.permalink
    #def get_absolute_url(self):
    #    return ( 'organisation', [ self.slug ] )

class OrganisationDataKey(DataKey):
    class Meta:
        app_label = 'popit'

class OrganisationData(Data):
    organisation = models.ForeignKey(Organisation, related_name='data')
    key = models.ForeignKey(OrganisationDataKey, related_name='values')
    class Meta:
        app_label = 'popit'

class OrganisationName(ModelBase):
    organisation = models.ForeignKey(Organisation, related_name='names')
    name        = models.CharField(max_length=300)
    main        = models.BooleanField()
    start_date  = ApproximateDateField(blank=True)
    end_date    = ApproximateDateField(blank=True)

    class Meta:
        ordering = [ '-main', '-start_date', 'end_date', 'name' ]
        app_label = 'popit'

    def save(self, *args, **kwargs):
        super(OrganisationName, self).save(*args, **kwargs)
        try:
            org = self.organisation
            org.slug = slugify(org.name)
            org.save()
        except:
            pass

    def __unicode__(self):
        return self.name

class OrganisationCode(models.Model):
    organisation    = models.ForeignKey(Organisation, related_name='codes')
    type            = models.ForeignKey(CodeType)
    code            = models.CharField(max_length=100)

    class Meta:
        app_label = 'popit'

    def __unicode__(self):
        return u'%s (%s)' % (self.code, self.type)

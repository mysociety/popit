import re

from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType
from django.contrib.gis.db import models
from django.template.defaultfilters import slugify

from django_date_extensions.fields import ApproximateDateField
from markitup.fields import MarkupField

from popit.models import ModelBase, DataKey, Data, date_help_text, CodeType

class Person(ModelBase):
    slug            = models.SlugField(editable=False)
    date_of_birth   = ApproximateDateField(blank=True, help_text=date_help_text)
    date_of_death   = ApproximateDateField(blank=True, help_text=date_help_text)
    #gender          = models.CharField(max_length=1, choices=(('m','Male'),('f','Female')) )
    description     = MarkupField(blank=True, default='')

    class Meta:
        ordering = [ 'slug' ]
        app_label = 'popit'
        verbose_name_plural = 'people'

    def __unicode__(self):
        return u'%s' % self.name

    @property
    def name(self):
        try:
            return self.names.all()[0]
        except:
            return 'Unknown'

    @models.permalink
    def get_absolute_url(self):
        return ( 'person', (), { 'pk': self.id, 'slug': self.slug } )

    #def is_mp(self):
    #    """Return the mp position if this person is an MP, else None"""
    #    try:
    #        return self.position_set.all().currently_active().filter(title__slug='mp')[0]
    #    except IndexError:
    #        return None

class PersonDataKey(DataKey):
    class Meta:
        app_label = 'popit'

class PersonData(Data):
    person = models.ForeignKey(Person, related_name='data')
    key = models.ForeignKey(PersonDataKey, related_name='values')
    class Meta:
        app_label = 'popit'
        verbose_name_plural = 'person data'

class PersonName(ModelBase):
    person      = models.ForeignKey(Person, related_name='names')
    title       = models.CharField(max_length=100, blank=True)
    name        = models.CharField(max_length=300)
    main        = models.BooleanField()
    start_date  = ApproximateDateField(blank=True)
    end_date    = ApproximateDateField(blank=True)

    class Meta:
        ordering = [ '-main', '-start_date', 'end_date', 'name' ]
        app_label = 'popit'

    def save(self, *args, **kwargs):
        super(PersonName, self).save(*args, **kwargs)
        try:
            person = self.person
            person.slug = slugify(person.name)
            person.save()
        except:
            pass

    def __unicode__(self):
        if self.title:
            return '%s %s' % (self.title, self.name)
        else:
            return self.name

class PersonCode(ModelBase):
    person      = models.ForeignKey(Person, related_name='codes')
    type        = models.ForeignKey(CodeType)
    code        = models.CharField(max_length=100)

    class Meta:
        app_label = 'popit'

    def __unicode__(self):
        return u'%s (%s)' % (self.code, self.type)

from django.contrib.contenttypes.models import ContentType
from django.contrib.gis.db import models
from django.core.urlresolvers import reverse

date_help_text = "Format: '2011-12-31', '31 Jan 2011', 'Jan 2011' or '2011' or 'future'"

# tell South how to handle the custom fields 
from south.modelsinspector import add_introspection_rules
add_introspection_rules([], ["^django_date_extensions\.fields\.ApproximateDateField"])

class ModelBase(models.Model):
    created = models.DateTimeField( auto_now_add=True )
    updated = models.DateTimeField( auto_now=True )

    class Meta:
       abstract = True      

#    def css_class(self):
#        return self._meta.module_name
#
    def get_admin_url(self):
        url = reverse(
            'admin:%s_%s_change' % ( self._meta.app_label, self._meta.module_name),
            args=[ self.id ],
        )
        return url

class CodeType(ModelBase):
    type = models.CharField(max_length=100)
    desc = models.CharField(max_length=200)

    class Meta:
        app_label = 'popit'

    def __unicode__(self):
        return self.type

class DataKey(ModelBase):
    name = models.CharField(max_length=200, db_index=True)

    class Meta:
        abstract = True

    def __unicode__(self):
        return self.name

# TODO Do we want start/end dates here?
class Data(ModelBase):
    #key         = models.ForeignKey(DataKey)
    value       = models.TextField()

    class Meta:
        abstract = True
        verbose_name_plural = 'data'

    def __unicode__(self):
        return u'%s = %s' % (self.key, self.value)

class ManagerBase(models.GeoManager):
    def update_or_create(self, filter_attrs, attrs):
        """Given unique look-up attributes, and extra data attributes, either
        updates the entry referred to if it exists, or creates it if it doesn't.
        
        Returns the object updated or created, having saved the changes.
        """
        try:
            obj = self.get(**filter_attrs)
            changed = False
            for k, v in attrs.items():
                if obj.__dict__[k] != v:
                    changed = True
                    obj.__dict__[k] = v
            if changed:
                obj.save()
        except exceptions.ObjectDoesNotExist:
            attrs.update(filter_attrs)
            obj = self.create(**attrs)
            obj.save()
        
        return obj

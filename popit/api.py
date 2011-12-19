# TODO
# Output base32 IDs
# Override key/value lookups to not need data__key__name=&data__value= somehow

from tastypie.cache import SimpleCache
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource
from tastypie.throttle import CacheThrottle
from tastypie import fields

from popit import models

class CommonResource(ModelResource):
    class Meta:
        allowed_methods = [ 'get' ]
        cache = SimpleCache()
        throttle = CacheThrottle(throttle_at=150, timeframe=3600)

class CodeTypeResource(CommonResource):
    class Meta:
        fields = [ 'type', 'desc' ]
        queryset = models.CodeType.objects.all()
        filtering = { 'type': ALL }

class DataKeyResource(CommonResource):
    class Meta:
        fields = [ 'name' ]
        filtering = { 'name': ALL }

class DataResource(CommonResource):
    class Meta:
        fields = [ 'value' ]
        filtering = {
            'key': ALL_WITH_RELATIONS,
            'value': ALL,
        }

# Organisations

class OrganisationResource(CommonResource):
    data = fields.ToManyField('popit.api.OrgDataResource', 'data', full=True)
    names = fields.ToManyField('popit.api.OrgNameResource', 'names', full=True)
    codes = fields.ToManyField('popit.api.OrgCodeResource', 'codes', full=True)
    positions = fields.ToManyField('popit.api.PositionResource', 'position_set')
    class Meta:
        queryset = models.Organisation.objects.all()
        filtering = {
            'started': ALL,
            'ended': ALL,
            'data': ALL_WITH_RELATIONS,
            'names': ALL_WITH_RELATIONS,
            'codes': ALL_WITH_RELATIONS,
        }

class OrgDataKeyResource(DataKeyResource):
    class Meta(DataKeyResource.Meta):
        queryset = models.OrganisationDataKey.objects.all()

class OrgDataResource(DataResource):
    key = fields.ToOneField(OrgDataKeyResource, 'key', full=True)
    class Meta(DataResource.Meta):
        queryset = models.OrganisationData.objects.all()

class OrgNameResource(CommonResource):
    class Meta:
        queryset = models.OrganisationName.objects.all()
        filtering = {
            'name': ALL,
            'main': ALL,
            'start_date': ALL,
            'end_date': ALL,
        }

class OrgCodeResource(CommonResource):
    type = fields.ToOneField(CodeTypeResource, 'type', full=True)
    class Meta:
        queryset = models.OrganisationCode.objects.all()
        filtering = {
            'code': ALL,
            'type': ALL_WITH_RELATIONS,
        }

# Person

class PersonResource(CommonResource):
    data = fields.ToManyField('popit.api.PersonDataResource', 'data', full=True)
    names = fields.ToManyField('popit.api.PersonNameResource', 'names', full=True)
    codes = fields.ToManyField('popit.api.PersonCodeResource', 'codes', full=True)
    positions = fields.ToManyField('popit.api.PositionResource', 'position_set', full=True)
    class Meta:
        queryset = models.Person.objects.all()
        filtering = {
            'date_of_birth': ALL,
            'date_of_death': ALL,
            'data': ALL_WITH_RELATIONS,
            'names': ALL_WITH_RELATIONS,
            'codes': ALL_WITH_RELATIONS,
        }

class PersonDataKeyResource(DataKeyResource):
    class Meta(DataKeyResource.Meta):
        queryset = models.PersonDataKey.objects.all()

class PersonDataResource(DataResource):
    key = fields.ToOneField(PersonDataKeyResource, 'key', full=True)
    class Meta(DataResource.Meta):
        queryset = models.PersonData.objects.all()

class PersonNameResource(CommonResource):
    class Meta:
        queryset = models.PersonName.objects.all()
        filtering = {
            'title': ALL,
            'name': ALL,
            'main': ALL,
            'start_date': ALL,
            'end_date': ALL,
        }

class PersonCodeResource(CommonResource):
    type = fields.ToOneField(CodeTypeResource, 'type', full=True)
    class Meta:
        queryset = models.PersonCode.objects.all()
        filtering = {
            'code': ALL,
            'type': ALL_WITH_RELATIONS,
        }

# Position

class PositionCategoryResource(CommonResource):
    class Meta:
        queryset = models.PositionCategory.objects.all()
        filtering = {
            'category': ALL,
        }

class PositionTypeResource(CommonResource):
    category = fields.ToOneField(PositionCategoryResource, 'category', full=True, null=True)
    organisation = fields.ToOneField(OrganisationResource, 'organisation', null=True)
    class Meta:
        queryset = models.PositionType.objects.all()
        filtering = {
            'name': ALL,
            'category': ALL_WITH_RELATIONS,
            'organisation': ALL_WITH_RELATIONS,
        }

# TODO: You'd really want full=True here, but then goes into an infinite loop.
# So needs some way of not setting full=True on person when we've got here
# via a person URI.
class PositionResource(CommonResource):
    person = fields.ToOneField(PersonResource, 'person')
    organisation = fields.ToOneField(OrganisationResource, 'organisation', null=True)
    type = fields.ToOneField(PositionTypeResource, 'type', full=True, null=True)
    # TODO: place can be either a CharField or a ForeignKey to mapit.
    # Need a way of linking to mapit place here if done that way...
    #if 'mapit' in settings.INSTALLED_APPS:
    #    place = fields.ToOneField(PlaceResource, null=True)

    class Meta:
        queryset = models.Position.objects.all()
        filtering = {
            'start_date': ALL,
            'end_date': ALL,
            'place': ALL_WITH_RELATIONS,
            'title': ALL,
            'type': ALL_WITH_RELATIONS,
            'organisation': ALL_WITH_RELATIONS,
            'person': ALL_WITH_RELATIONS,
        }

class PositionDataKeyResource(DataKeyResource):
    class Meta(DataKeyResource.Meta):
        queryset = models.PositionDataKey.objects.all()

class PositionDataResource(DataResource):
    key = fields.ToOneField(PositionDataKeyResource, 'key', full=True)
    class Meta(DataResource.Meta):
        queryset = models.PositionData.objects.all()


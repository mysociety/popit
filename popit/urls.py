# TODO
# HTML representations - not implemented in tastypie yet, not sure if one of
#   the many issues or forks on github deals with this.
# Index page etc. documentation

from django.conf.urls.defaults import patterns, url, include

from tastypie.api import Api
from popit.api import PersonResource, OrganisationResource, PositionResource

v1_api = Api(api_name='v1')
v1_api.register(PersonResource())
v1_api.register(OrganisationResource())
v1_api.register(PositionResource())

urlpatterns = patterns('',
    url( r'', include(v1_api.urls)),
)


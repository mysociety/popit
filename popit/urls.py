from django.conf.urls.defaults import patterns, url
from django.views.generic import TemplateView, ListView, DetailView

from popit.models import Person, Organisation

urlpatterns = patterns('',
    url( r'^$', TemplateView.as_view(template_name='popit/index.html') ),

    # TODO Apply lookup query string to people to filter
    (r'^people$', ListView.as_view(
        model=Person,
        context_object_name='person_list',
    )),
    url(r'^person/(?P<pk>.*?)/(?P<slug>.*)$', DetailView.as_view(
        model=Person,
    ), name='person'),

    (r'^organisations$', ListView.as_view(
        model=Organisation,
        context_object_name='org_list',
    )),
    (r'^organisation/(?P<pk>.*?)/(?P<slug>[-\w]+)$', DetailView.as_view(
        model=Organisation,
    )),

)


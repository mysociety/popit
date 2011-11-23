# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'CodeType'
        db.create_table('popit_codetype', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('type', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('desc', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal('popit', ['CodeType'])

        # Adding model 'PersonCode'
        db.create_table('popit_personcode', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('person', self.gf('django.db.models.fields.related.ForeignKey')(related_name='codes', to=orm['popit.Person'])),
            ('type', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['popit.CodeType']))
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal('popit', ['PersonCode'])

        # Adding model 'PersonData'
        db.create_table('popit_persondata', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('value', self.gf('django.db.models.fields.TextField')()),
            ('person', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['popit.Person'])),
            ('key', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['popit.PersonDataKey'])),
        ))
        db.send_create_signal('popit', ['PersonData'])

        # Adding model 'PersonName'
        db.create_table('popit_personname', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('person', self.gf('django.db.models.fields.related.ForeignKey')(related_name='names', to=orm['popit.Person'])),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300)),
            ('main', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('start_date', self.gf('django_date_extensions.fields.ApproximateDateField')(max_length=10, blank=True)),
            ('end_date', self.gf('django_date_extensions.fields.ApproximateDateField')(max_length=10, blank=True)),
        ))
        db.send_create_signal('popit', ['PersonName'])

        # Adding model 'PersonDataKey'
        db.create_table('popit_persondatakey', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=200, db_index=True)),
        ))
        db.send_create_signal('popit', ['PersonDataKey'])

        # Adding model 'Person'
        db.create_table('popit_person', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=50, db_index=True)),
            ('date_of_birth', self.gf('django_date_extensions.fields.ApproximateDateField')(max_length=10, blank=True)),
            ('date_of_death', self.gf('django_date_extensions.fields.ApproximateDateField')(max_length=10, blank=True)),
            ('description', self.gf('markitup.fields.MarkupField')(default='', no_rendered_field=True, blank=True)),
            ('_description_rendered', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('popit', ['Person'])


    def backwards(self, orm):
        
        # Deleting model 'PersonCode'
        db.delete_table('popit_personcode')

        # Deleting model 'PersonData'
        db.delete_table('popit_persondata')

        # Deleting model 'PersonName'
        db.delete_table('popit_personname')

        # Deleting model 'PersonDataKey'
        db.delete_table('popit_persondatakey')

        # Deleting model 'Person'
        db.delete_table('popit_person')

        # Deleting model 'CodeType'
        db.delete_table('popit_codetype')


    models = {
        'popit.codetype': {
            'Meta': {'object_name': 'CodeType'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'desc': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'popit.person': {
            'Meta': {'ordering': "['slug']", 'object_name': 'Person'},
            '_description_rendered': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'date_of_birth': ('django_date_extensions.fields.ApproximateDateField', [], {'max_length': '10', 'blank': 'True'}),
            'date_of_death': ('django_date_extensions.fields.ApproximateDateField', [], {'max_length': '10', 'blank': 'True'}),
            'description': ('markitup.fields.MarkupField', [], {'default': "''", 'no_rendered_field': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50', 'db_index': 'True'}),
            'updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'popit.personcode': {
            'Meta': {'object_name': 'PersonCode'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'person': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'codes'", 'to': "orm['popit.Person']"}),
            'type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['popit.CodeType']"}),
            'updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'popit.persondata': {
            'Meta': {'object_name': 'PersonData'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['popit.PersonDataKey']"}),
            'person': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['popit.Person']"}),
            'updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'value': ('django.db.models.fields.TextField', [], {})
        },
        'popit.persondatakey': {
            'Meta': {'object_name': 'PersonDataKey'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'db_index': 'True'}),
            'updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        'popit.personname': {
            'Meta': {'ordering': "['-main', '-start_date', 'end_date', 'name']", 'object_name': 'PersonName'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'end_date': ('django_date_extensions.fields.ApproximateDateField', [], {'max_length': '10', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'main': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300'}),
            'person': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'names'", 'to': "orm['popit.Person']"}),
            'start_date': ('django_date_extensions.fields.ApproximateDateField', [], {'max_length': '10', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['popit']

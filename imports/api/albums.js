import { Mongo } from 'meteor/mongo';

Albums = new Mongo.Collection( 'albums' );

if ( Meteor.isServer ) {
  Albums._ensureIndex( { title: 1, artist: 1, year: 1 } );
}

Albums.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Albums.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let AlbumsSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'The title of this album.'
  },
  'artist': {
    type: String,
    label: 'The artist of this album.'
  },
  'year': {
    type: String,
    label: 'The year this album was released.'
  }
});

Albums.attachSchema( AlbumsSchema );

Meteor.publish( 'albums', function( search ) {
  check( search, Match.OneOf( String, null, undefined ) );

  let query      = {},
      projection = { limit: 10, sort: { title: 1 } };

  if ( search ) {
    let regex = new RegExp( search, 'i' );

    query = {
      $or: [
        { title: regex },
        { artist: regex },
        { year: regex }
      ]
    };

    projection.limit = 100;
  }

  return Albums.find( query, projection );
});

Meteor.methods({
  'insert .album'(artist, album, year) {
    Albums.insert({
      artist: artist,
      title: title,
      year: year
    });
  }
});
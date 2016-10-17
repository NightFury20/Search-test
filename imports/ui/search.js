import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './search.html';

Template.search.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'albums', template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
});
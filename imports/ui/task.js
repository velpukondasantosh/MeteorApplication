import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';


import './task.html';

Template.task.helpers({
  isOwner() {
    //Meteor.call('roles.checkRole');
    return this.owner === Meteor.userId();
    
  },
  formatedDate: function() {
    //return moment().add(1, 'weeks').isoWeekday(4);()
    return moment(this.createdAt).format("DD-MM-YYYY")+"  "+moment(this.createdAt).format("dddd");
  }
});

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
});
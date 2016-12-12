import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

 
export const Tasks = new Mongo.Collection('tasks');
export const Roles = new Mongo.Collection('roles');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
   
    var iRowCount=0;
    var insertDate = new Date();
    insertDate = moment(insertDate).add(1, 'weeks').isoWeekday(1);
    insertDate = moment(insertDate).format("YYYY-MM-DD");
    var time1 = "T00:00:00.000Z";
    
    iRowCount = Tasks.find ({
       $and: [
       {"createdAt": { "$gte" : new Date(insertDate+time1) }},
       { owner: this.userId },
       ],
      }).count();
    if (!! this.userId)
    console.log("User Id:"+this.userId);

    console.log("Row Count:"+iRowCount);
    
    if (iRowCount == 0 && !! this.userId){
      var text = "Simple Task1";
      for (var i=1; i<=7; i++){
        var insertDate = new Date();
        insertDate = moment(insertDate).add(1, 'weeks').isoWeekday(i);
        insertDate = moment(insertDate).format("YYYY-MM-DD");
        console.log("Insert Date:"+insertDate);
          Tasks.insert({
          text,
          createdAt: new Date(insertDate+time1),
          owner: this.userId,
          username: Meteor.users.findOne(this.userId).username,
        });
    }
    
    }
    
    /*
      return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
    */
    var queryDate = new Date();
    //insertDate = moment(insertDate).add(1, 'weeks').isoWeekday(i);
    queryDate = moment(queryDate).add(1, 'weeks').isoWeekday(1);
    queryDate = moment(queryDate).format("YYYY-MM-DD");

    var time1 = "T00:00:00.000Z";
    if (!!this.userId)
    return Tasks.find ({"createdAt": { "$gte" : new Date(queryDate+time1) }});
  });
}


Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
    
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },

  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },

'roles.checkRole'() {
    //check(text, String);
     
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    };
    var iRowCount = 0;
    var uname = Meteor.users.findOne(this.userId).username;
    console.log("Role Checking for:"+uname);
    iRowCount = Roles.find({
      //{ username: uname }
    }).count();

    console.log("Row Count:"+iRowCount);
    if ( iRowCount == 0) {
      console.log("Role Created for:"+uname);
      Roles.insert({
        username: uname,
        roleId: 100,
      });
    }
    //return Roles.find({
      //{ username: uname }
    //}); 
    
  },

});

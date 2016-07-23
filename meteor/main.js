Posts = new Meteor.Collection('posts');

if (Meteor.isClient) {
    //Meteor.subscribe("mycollection");
    console.log(Posts.findOne());
    Template.cards.helpers({
        posts: function() {
            return Posts.find({}, {sort: {created_time: -1}}).fetch();
        }
    });
    Template.cards.helpers({
        formatDate: function(time) {
            if ((moment().unix() - moment(time).unix()) < 3600) {
                return moment(time).calendar();
            } else {
                return moment(time).calendar();
            }
        },

    })
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
        console.log(Posts.findOne());
    });
}

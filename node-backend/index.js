var mongoose = require('mongoose');
var http = require('https');
var vars = require('./vars')
mongoose.connect(vars.dburl);
var limit = 99
console.log(vars.dburl)

var find = function(a, fbResponse, candidate) {
    if (a < limit) {
        if (candidate == 1) {
            var posts = fbResponse.govgaryjohnson.posts.data[a];
            var author = "Governor Gary Johnson";
        } else if (candidate == 2) {
            var posts = fbResponse.libertarians.posts.data[a];
            var author = "The Libertarian Party";
        } else if (candidate == 3) {
            var posts = fbResponse.beingalibertarian.posts.data[a];
            var author = "Being Libertarian";
        } else if (candidate == 4) {
            var posts = fbResponse.libertyviral.posts.data[a];
            var author = "Liberty Viral";
        } else if (candidate == 5) {
            var posts = fbResponse.libertarianrepublic.posts.data[a];
            var author = "Libertarian Republic";
        }
        Post.findOne({ 'postid': posts.id }, 'message', function(err, post) {
            if (err) return handleError(err);
            if (!post) {
                var post = new Post({ message: posts.message, author: author, full_picture: posts.full_picture, created_time: posts.created_time, postid: posts.id });
                post.save(function(err) {
                    if (err)
                        console.log(err);
                    else
                        console.log('finn')
                });
            }
        });
        a++;
        if(a == 99) console.log('finished',candidate)
        find(a, fbResponse, candidate)
    }
}

var FbPostSchema = new mongoose.Schema({
    message: String,
    created_time: Date,
    postid: String,
    full_picture: String,
    author: String,
    updated_at: { type: Date, default: Date.now },
});

var Post = mongoose.model('Posts', FbPostSchema);

var url = "https://graph.facebook.com/?ids=govgaryjohnson,libertarianrepublic,libertyviral,libertarians,beingalibertarian&fields=posts.limit(100){message,created_time,picture,full_picture}&access_token=693703604116831|qmUNCPyhOzj_8oMnyt0fy_-HPMY";

function getposts() {
    http.get(url, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var fbResponse = JSON.parse(body);
            var a = 0;
            find(a, fbResponse, 1);
            a = 0;
            find(a, fbResponse, 2);
            a = 0;
            find(a, fbResponse, 3);
            a = 0;
            find(a, fbResponse, 4);
            a = 0;
            find(a, fbResponse, 5);
        });
    }).on('error', function(e) {
        console.log("Got an error: ", e);
    });
    setTimeout(getposts, 180000)
}

getposts(url)
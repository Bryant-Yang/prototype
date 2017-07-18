
var fs = require('fs');
var swig = require('swig');

swig.renderFile('./index.swig', {
    projects: ['乐收书评榜']
}, function (err, output){
    if (err){
        return console.logi(err);
    }

    fs.writeFile("./index.html", output, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
});

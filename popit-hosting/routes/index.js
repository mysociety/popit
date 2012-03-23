
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render(
        'index.html',
        {
            locals: { title: 'Express' }
        }
    );
};

exports.new = function(req, res){

    console.log(req.query);

    res.render(
        'new.html',
        {
            locals: { title: 'New instance' }
        }
    );
};


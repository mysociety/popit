
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
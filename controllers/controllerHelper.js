
module.exports.checkParameters = function(params)
{
    for (let param of params)
    {
        if ((!param) || (param === undefined)) {
            return {
                valid : false,
                message: 'no '.concat(param).concat('specified')
            }
        }
        else
        {
            return {valid : true}
        }
    }
};

module.exports.checkParam = function(param)
{
    return (param) && (param !== undefined);
};

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

checkParam = function(param)
{
    return (param) && (param !== undefined);
};

module.exports.checkParam = checkParam;

module.exports.updateQueryParams = function(updateParams)
{
    reqs = {};
    for (let param in updateParams)
    {
        if (checkParam(param))
        {
            reqs[param] = updateParams[param];
        }
    }
    return reqs;

};
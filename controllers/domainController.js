module.exports.getDomain = async function (req, res, next) {
    let domainName = req.query.domain_name;
    var res_data = {title : "Информация о домене"};
    if ((!domainName) || (domainName === undefined))
    {
        res.json({ message: 'no domain name'});
        return;
    }
    try {
        let domain = await Item.findOne({name : domainName});
        res_data.description = domain.description;
        res.json(res_data);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
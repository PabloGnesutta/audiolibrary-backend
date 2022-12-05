exports.get404 = (req, res, next) => {
    res.json({ message: 'Page not found' });
};

exports.erorHandler = (error, req, res, next) => {
    console.log(error);
    res.status(error.status).json(error.message);
};

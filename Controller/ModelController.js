exports.getModels = async (req, res) => {
    try {
        const models = await Model.find().populate('tailor', 'firstName lastName');
        res.status(200).json(models);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getModelById = async (req, res) => {
    try {
        const model = await Model.findById(req.params.id).populate('tailor', 'firstName lastName');
        if (!model) {
            return res.status(404).json({ msg: 'Model not found' });
        }
        res.status(200).json(model);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateModel = async (req, res) => {
    const { error } = modelValidation(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    try {
        const model = await Model.findById(req.params.id);
        if (!model) {
            return res.status(404).json({ msg: 'Model not found' });
        }

        if (model.tailor.toString() !== req.user) {
            return res.status(403).json({ msg: 'User not authorized' });
        }

        model.title = req.body.title;
        model.description = req.body.description;
        model.image = req.body.image;

        await model.save();

        res.status(200).json(model);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteModel = async (req, res) => {
    try {
        const model = await Model.findById(req.params.id);
        if (!model) {
            return res.status(404).json({ msg: 'Model not found' });
        }

        if (model.tailor.toString() !== req.user) {
            return res.status(403).json({ msg: 'User not authorized' });
        }

        await model.remove();

        res.status(200).json({ msg: 'Model removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

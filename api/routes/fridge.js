import { Router } from 'express';
import { getFridgeById, updateFridge, createFridge, deleteFridge } from '../models/fridgeModel.js';
import { isLoggedIn, isOwner, isMember } from '../authorization.js';

const router = Router();

router.get('/:fridgeID', isLoggedIn, async (req, res) => {
    if (!(await isOwner(req.session.user, req.params.fridgeID)) && !(await isMember(req.session.user, req.params.fridgeID))) {
        const error = new Error(`User ${req.session.user.id} is not permitted to GET fridge ${req.params.fridgeID}`);
        error.status = 403;
        throw error;
    }

    const result = await getFridgeById(req.params.fridgeID);
    res.json(result);
});

router.patch('/:fridgeID', isLoggedIn, async (req, res) => {
    if (!(await isOwner(req.session.user, req.params.fridgeID))) {
        const error = new Error(`User ${req.session.user.id} is not permitted to PATCH fridge ${req.params.fridgeID}`);
        error.status = 403;
        throw error;
    }

    const result = await updateFridge(req.params.fridgeID, req.body);
    res.json(result);
});

router.put('/', isLoggedIn, async (req, res) => {
    if (req.body.ownerID != req.session.user.id) {
        const error = new Error(`Mismatch between current user (${req.session.user.id}} and owner of new fridge ${req.body.ownerID}`);
        error.status = 403;
        throw error;
    }
    const result = await createFridge(req.body);
    res.json({ success: result });
});

router.delete('/:fridgeID', isLoggedIn, async (req, res) => {
    if (!(await isOwner(req.session.user, req.params.fridgeID))) {
        const error = new Error(`User ${req.session.user.id} is not permitted to DELETE fridge ${req.params.fridgeID}`);
        error.status = 403;
        throw error;
    }

    const result = await deleteFridge(req.params.fridgeID);
    res.json({ success: result });
});


export default router;

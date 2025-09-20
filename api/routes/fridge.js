import { Router } from 'express';
import { getFridgeById, updateFridge, createFridge, deleteFridge } from '../models/fridgeModel.js';
import { isLoggedIn, isOwner } from '../authorization.js';

const router = Router();

router.get('/:id', async (req, res) => {
    const result = await getFridgeById(req.params.id);
    res.json(result);
});

router.patch('/:id', isLoggedIn, isOwner, async (req, res) => {
    const result = await updateFridge(req.params.id, req.body);
    res.json(result);
});

router.put('/', async (req, res) => {
    const result = await createFridge(req.body);
    res.json({ success: result });
});

router.delete('/:id', async (req, res) => {
    const result = await deleteFridge(req.params.id);
    res.json({ success: result });
});


export default router;

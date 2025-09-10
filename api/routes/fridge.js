import { Router } from 'express';
import { getFridgeById, updateFridge, createFridge } from '../models/fridgeModel.js';
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
    res.json(result);
});


export default router;

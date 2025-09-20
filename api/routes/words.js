import { Router } from 'express';
import { getFridgeWords } from '../models/wordModel.js';

const router = Router();

router.get('/:fridgeID', async (req, res) => {
    const wordsOnFridge = await getFridgeWords(req.params.fridgeID);

    const result = wordsOnFridge.map(word => {
        return {
            id: word.id,
            position: { x: word.position_x, y: word.position_y },
            text: word.word,
            lastMoved: word.last_moved,
            lastMovedBy: word.last_moved_by
        }
    });

    res.json(result);
});

export default router;

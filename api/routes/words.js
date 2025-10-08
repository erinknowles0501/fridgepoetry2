import { Router } from 'express';
import { getFridgeWords } from '../models/wordModel.js';
import { isLoggedIn, isOwner, isMember } from '../authorization.js';

const router = Router();

router.get('/:fridgeID', isLoggedIn, async (req, res) => {
    if (!(await isOwner(req.session.user.id, req.params.fridgeID)) && !(await isMember(req.session.user, req.params.fridgeID))) {
        const error = new Error(`User ${req.session.user.id} is not permitted to GET words of fridge ${req.params.fridgeID}`);
        error.status = 403;
        throw error;
    }

    const wordsOnFridge = await getFridgeWords(req.params.fridgeID);

    const result = wordsOnFridge.map(word => {
        return {
            id: word.id,
            position: { x: word.position_x, y: word.position_y },
            text: word.text,
            lastMoved: word.last_moved,
            lastMovedBy: word.last_moved_by
        }
    });

    res.json(result);
});

export default router;

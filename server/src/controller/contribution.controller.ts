import { Request, Response } from 'express';
import { ApiError } from '../util/apiError';
import { ContributionReturnType } from '../model/contribution.model';
import { contributionGetService } from '../service/contribution.service';

export const contributionCreateController = async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;

        const contri: ContributionReturnType[] = await contributionGetService(userId);

        res.status(200).json({
            message: 'Contributions fetched',
            contributions: contri,
        });

    } catch (error) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};


import { Request, Response } from 'express';
import { DeleteMenuUseCase } from '../../application/deleteMenuUseCase';

export class DeleteMenuController {
  constructor(private readonly deleteMenuUseCase: DeleteMenuUseCase) {}

  async run(req: Request, res: Response) {
    const { uuid } = req.params;

    try {
      const menu = await this.deleteMenuUseCase.run(uuid);
      if (menu) {
        res.status(200).send({ status: 'success', message: "Menu Deleted Succesfully" });
      } else {
        res.status(404).send({ status: 'error', message: 'Menu not found' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Server error', error });
    }
  }
}

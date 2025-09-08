import { Request, Response } from 'express';
import { DeleteSubMenuUseCase } from '../../application/deleteSubMenuUseCase';

export class DeleteSubMenuController {
  constructor(private readonly deleteSubMenuUseCase: DeleteSubMenuUseCase) {}

  async run(req: Request, res: Response) {
    const { uuid } = req.params;

    try {
      const menu = await this.deleteSubMenuUseCase.run(uuid);
      if (menu) {
        res.status(200).send({ status: 'success', message: "Submenu Deleted Succesfully" });
      } else {
        res.status(404).send({ status: 'error', message: 'Submenu not found' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Error deleting submenu', error });
    }
  }
}

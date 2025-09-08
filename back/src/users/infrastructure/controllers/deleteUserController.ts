import { Request, Response } from 'express';
import { DeleteUserUseCase } from '../../application/deleteUserUseCase';

export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  async run(req: Request, res: Response) {
    const { uuid } = req.params;

    try {
      const user = await this.deleteUserUseCase.run(uuid);
      if (user) {
        res.status(200).send({ status: 'success', message: "User Deleted Succesfully" });
      } else {
        res.status(404).send({ status: 'error', message: 'User not found' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Server error', error });
    }
  }
}

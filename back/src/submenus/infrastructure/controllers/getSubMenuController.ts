import { Request, Response } from 'express';
import { GetSubMenuUseCase } from '../../application/getSubMenuUseCase';

export class GetSubMenuController {
  constructor(private readonly getSubMenuUseCase: GetSubMenuUseCase) {}

  async run(req: Request, res: Response) {
    const { uuid } = req.params;
    //console.log(uuid);
    
    try {
      const menu = await this.getSubMenuUseCase.run(uuid);
      if (menu) {
        res.status(200).send({ 
          data: {
            type: "submenu",
            id: menu.getUuid(),
            attributes: {
              uuid: menu.getUuid(),
              name: menu.getName(),
              description: menu.getDescription(),
              icon: menu.getIcon(),
              path: menu.getPath(),
              active: menu.getActive()
            }
          }});
      } else {
        res.status(404).send({ status: 'error', message: 'User not found' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Server error', error });
    }
  }
}

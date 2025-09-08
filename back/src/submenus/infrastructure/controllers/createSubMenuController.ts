import { Request, Response } from 'express';
import { CreateSubMenuUseCase } from '../../application/createSubMenuUseCase';

export class CreateSubMenuController {
  constructor(private readonly createSubMenuUseCase: CreateSubMenuUseCase) {}

  async run(req: Request, res: Response) {
    const { name, description, component_name, path, sort_order, id_menu } = req.body;

    try {
      const menu = await this.createSubMenuUseCase.run(
        name,
        description,
        component_name,
        path,
        sort_order,
        id_menu
      );

      if (menu) {
        res.status(201).send({
          data: {
            type: "submenu",
            id: menu.getUuid(),
            attributes: {
              uuid: menu.getUuid(),
              name: menu.getName(),
              description: menu.getDescription(),
              icon: menu.getIcon(),
              path: menu.getPath(),
              active: menu.getActive(),
              sort_order: menu.getOrder(),
              component_name: menu.getComponentName()
            }
          } 
        });
      } else {
        res.status(400).send({ status: 'error', message: 'Could not create menu' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Server error', error });
    }
  }
}

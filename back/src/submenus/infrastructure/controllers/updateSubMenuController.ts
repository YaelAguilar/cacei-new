import { Request, Response } from 'express';
import { UpdateSubMenuUseCase } from '../../application/updateSubMenuUseCase';

export class UpdateSubMenuController {
  constructor(private readonly updateSubMenuUseCase: UpdateSubMenuUseCase) { }

  async run(req: Request, res: Response) {
    const { uuid } = req.params;
    const { name, description, path, sort_order, component_name } = req.body;


    const submenu = await this.updateSubMenuUseCase.run(uuid, name, description, component_name,
      path, sort_order);

    if (submenu) {
      res.status(200).send({
        data: {
          type: "submenu",
          id: submenu.getUuid(),
          attributes: {
            uuid: submenu.getUuid(),
            name: submenu.getName(),
            description: submenu.getDescription(),
            icon: submenu.getIcon(),
            path: submenu.getPath(),
            active: submenu.getActive(),
            sort_order: submenu.getOrder(),
            component_name: submenu.getComponentName()
          }
        }
      });
    } else {
      res.status(400).send({ status: 'error', message: 'Could not update submenú' });
    }

  }
}

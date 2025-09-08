import { Request, Response } from 'express';
import { UpdateMenuUseCase } from '../../application/updateMenuUseCase';

export class UpdateMenuController {
  constructor(private readonly updateMenuUseCase: UpdateMenuUseCase) { }

  async run(req: Request, res: Response) {
    const { uuid } = req.params;
    const { name, description, icon, path, order, active, is_navegable, component_name, feature_name } = req.body;

    const menu = await this.updateMenuUseCase.run(uuid, name, description, icon,
      path, order, active, is_navegable, component_name, feature_name);

    if (menu) {
      res.status(200).send({
        data: {
          type: "menu",
          id: menu.getUuid(),
          attributes: {
            uuid: menu.getUuid(),
            name: menu.getName(),
            description: menu.getDescription(),
            icon: menu.getIcon(),
            path: menu.getPath(),
            orden: menu.getOrden(),
            active: menu.getActivo(),
            is_navegable: menu.getIsNavegable(),
            component_name: menu.getComponentName(),
            feature_name: menu.getFeatureName()
          },
          meta: {
            submenuCount: (menu as any).submenuCount || menu.getSubmenuCount() || 0
          }
        }
      });
    } else {
      res.status(400).send({ status: 'error', message: 'Could not update menu' });
    }

  }
}

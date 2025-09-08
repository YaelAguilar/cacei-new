import { Request, Response } from 'express';
import { CreateMenuUseCase } from '../../application/createMenuUseCase';

export class CreateMenuController {
  constructor(private readonly createMenuUseCase: CreateMenuUseCase) { }

  async run(req: Request, res: Response) {
    const { name, description, icon, path, order, is_navegable, component_name, feature_name } = req.body;

    try {
      const menu = await this.createMenuUseCase.run(
        name,
        description,
        icon,
        path,
        order,
        is_navegable,
        component_name,
        feature_name
      );

      if (menu) {
        res.status(201).send({
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
        res.status(400).send({ status: 'error', message: 'Could not create menu' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Server error', error });
    }
  }
}

import { Request, Response } from 'express';
import { GetMenuUseCase } from '../../application/getMenuUseCase';

export class GetMenuController {
  constructor(private readonly getMenuUseCase: GetMenuUseCase) {}

  async run(req: Request, res: Response) {
    const { uuid } = req.params;
    //console.log(uuid);
    
    try {
      const menu = await this.getMenuUseCase.run(uuid);
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

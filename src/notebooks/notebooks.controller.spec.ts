import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { HttpException, HttpStatus } from '@nestjs/common';



describe('NotebooksController', () => {
  let controller: NotebooksController;
  let service: NotebooksService;
  let mockService ={
      create: jest.fn(),
      findAll: jest.fn(),
    }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers :[NotebooksController],
      providers: [NotebooksService],
  })
    .overrideProvider(NotebooksService)
    .useValue(mockService)
    .compile();

    controller =module.get<NotebooksController>(NotebooksController);
    service = module.get<NotebooksService>(NotebooksService);
  });

  it('deberia devolver todas las notebooks', async () => {
    const mockNotebooks = [
      {id:1, title:'hp' ,content:'computadora de escritorio'},
      {id:2, title:'dell',content:'computadora portatil'},
      {id:3, title:'Bangho',content:'notebook'}
    ]; 
    jest.spyOn(service,'findAll').mockResolvedValue(mockNotebooks); 
    const result = await controller.findAll();
    expect(result).toEqual(mockNotebooks);
    
  });

  it('deberia lanzar un Error en caso que no encuentre findAll', async()=>{
      mockService.findAll.mockRejectedValue(new Error('DB error'));
      await expect(controller.findAll()).rejects.toThrow(
      new HttpException('Error retrieving notebooks', HttpStatus.BAD_REQUEST))
  });
  

  it('deberia poder crear una notebooks en la db', async () =>{
    const notebookDto =  { title: 'lenovo', content: 'nueva notebook' }
    const agregarNotebook ={id: 1, ...notebookDto};
    mockService.create.mockResolvedValue(agregarNotebook);

    const result = await controller.create(notebookDto);
    expect(result).toEqual(agregarNotebook);
    expect(service.create).toHaveBeenCalledWith(notebookDto); 
  })

}); 

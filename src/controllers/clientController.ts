import { Request, Response } from 'express';
import { ClientService } from '../services/clientService';
import { ApiResponse } from '../types/database';
import { asyncHandler } from '../middleware/errorHandler';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  getAllClients = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const clients = await this.clientService.getAllClients();
    res.status(200).json({
      success: true,
      data: clients,
      message: 'Clients retrieved successfully'
    });
  });

  getClientById = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const client = await this.clientService.getClientById(id);
    res.status(200).json({
      success: true,
      data: client,
      message: 'Client retrieved successfully'
    });
  });

  createClient = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const client = await this.clientService.createClient(req.body);
    res.status(201).json({
      success: true,
      data: client,
      message: 'Client created successfully'
    });
  });

  updateClient = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const client = await this.clientService.updateClient(id, req.body);
    res.status(200).json({
      success: true,
      data: client,
      message: 'Client updated successfully'
    });
  });

  deleteClient = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    await this.clientService.deleteClient(id);
    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  });
}
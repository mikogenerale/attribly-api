import { Controller, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service.js';

@Controller('stores')
export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    @Get()
    async getStores() {
        return await this.storeService.getStores();
    }

    @Get(':datasetId')
    async getStoreById(@Param('datasetId') datasetId: string) {
        return await this.storeService.getStoreById(datasetId);
    }

    @Get(':datasetId/tables')
    async getStoreTables(@Param('datasetId') datasetId: string) {
        return await this.storeService.getStoreTables(datasetId);
    }

    @Get(':datasetId/tables/:tableId')
    async getStoreTableData(
        @Param('datasetId') datasetId: string,
        @Param('tableId') tableId: string,
        @Param('pageToken') pageToken?: string
    ) {
        return await this.storeService.getStoreTableData(datasetId, tableId, pageToken);
    }
}

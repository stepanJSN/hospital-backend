import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Public } from 'src/decorators/public.decorator';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/guards/role.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AvatarsService } from 'src/avatars/avatar.service';
import { OwnerOrAdminGuard } from 'src/guards/owner-admin.guard';
import { FindAllCustomerDto } from './dto/find-all-customers.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly avatarsService: AvatarsService,
  ) {}

  @Public()
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard)
  @Get()
  findAll(@Query() findAllCustomers: FindAllCustomerDto) {
    return this.customersService.findAll(
      findAllCustomers.firstName,
      findAllCustomers.lastName,
      +findAllCustomers.page,
      +findAllCustomers.take,
    );
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customersService.findOneById(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  @Patch('/current')
  update(
    @CurrentUser('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete('/:userId')
  @UseGuards(OwnerOrAdminGuard)
  async remove(@Param('userId') id: string) {
    await this.avatarsService.deleteByUserId(id);
    return this.customersService.remove(id);
  }
}

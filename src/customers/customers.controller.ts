import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  UsePipes,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';
// import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Public()
  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Roles(Role.Admin, Role.Customer, Role.Staff)
  @UseGuards(RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOneById(id);
  }

  @Roles(Role.Customer)
  @UseGuards(RoleGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Roles(Role.Customer, Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}

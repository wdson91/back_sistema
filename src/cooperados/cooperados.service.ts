import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCooperadoDto } from './dto/create-cooperado.dto';
import { UpdateCooperadoDto } from './dto/update-cooperado.dto';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CooperadosService {

  constructor(private  prismaService: PrismaService,private authService:AuthService) {}


  async create(createCooperadoDto: CreateCooperadoDto,userId: string) {
    
    await this.authService.create(createCooperadoDto,userId,'cooperado');

  }

  async findAll(userId:string, role:string) {
    

    if (role === 'comercial') {
      const  users = await this.prismaService.cooperado.findMany(
        {
          where:{
            comercialId:userId
          }
        }
      )

      return users
    }

    const  users = await this.prismaService.cooperado.findMany()

    return users;

  }


  async findAllDeactivate(userId:string, role:string):Promise<any> {
    
    
    if (role === 'comercial') {
      const  users = await this.prismaService.cooperado.findMany(
        {
          where:{
            comercialId:userId,
            AND:{
              is_active :false
            }
            
          }
        }
      )

      users.forEach(user => {
        delete user.password;
      });

      return users
    }

    let  users = await this.prismaService.cooperado.findMany()

    //REMOVER A SENHA DOS USUÁRIOS

    return users.map(user => {
    const { password, ...rest } = user; // Remove o campo password
    return rest;
    });



  }

  async findOne(id: number) {
    return `This action returns a #${id} cooperado`;
  }

  async update(id: number, updateCooperadoDto: UpdateCooperadoDto) {
    return `This action updates a #${id} cooperado`;
  }

  async remove(id: number) {
    return `This action removes a #${id} cooperado`;
  }

  async updateStatus(id: string, arg: boolean) {

    const user = await this.prismaService.cooperado.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }
    if (user.is_active === arg) {
      throw new ConflictException('Status already set');
    }

     // Atualiza o status do usuário E retorna o usuário atualizado SEM A SENHA

    return await this.prismaService.cooperado.update({
      where: { id },
      data: {
        is_active: arg,
      },
      omit: {
       
        password: true,
      },  
    });



  }
  
}

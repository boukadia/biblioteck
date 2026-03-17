import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { log } from 'node:console';
import { Prisma } from 'src/prisma/entities/prisma.entity';
import { RoleUtilisateur, StatutUtilisateur } from '@prisma/client';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }


  findAll() {
    //
    // if(users.role!== "ADMIN") {
    //   throw new BadRequestException("you don't have the right to access this resource")
    // }
    const users = this.prisma.utilisateur.findMany(
      {
        select: {
          id: true,
          nom: true,
          email: true,
          statut: true,
          role: true,
          xp: true,
          niveau: true,
          pointsActuels: true
        }
      }
    )
    return users;
  }
  async changeStatus(id: number, user) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new ForbiddenException("you don't have the right to access this resource")
    }

    const checkedUser = await this.prisma.utilisateur.findUnique({
      where: {
        id: id
      }
    })
    if (!checkedUser) {
      throw new BadRequestException("user not found")
    }
    if (user.statut === StatutUtilisateur.ACTIF) {
      const updatedUser = await this.prisma.utilisateur.update({
        where: {
          id: id
        },
        data: {
          statut: 'BLOQUE',
        }
      })
      return updatedUser
    }
    else {
      const updatedUser = await this.prisma.utilisateur.update({
        where: {
          id: id
        },
        data: {
          statut: 'ACTIF'
        },

      })
      return updatedUser



    }
  }

  async findOne(id: number) {

    const user = await this.prisma.utilisateur.findFirst({
      where: {
        id: id
      },
      select: {
        id: true,
        nom: true,
        email: true,
        statut: true,
        role: true,
        xp: true,
        niveau: true,
        pointsActuels: true,
        badgesObtenus: { include: { badge: true } },
        emprunts: true,
      }
    })
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    //  if(user.role!=="ADMIN" && user.id!==id ){
    // throw new NotFoundException("you don't have the right to access this resource")
    // }
    const user = await this.prisma.utilisateur.findUnique({
      where: {
        id: id
      }
    })


    if (!user) {
      throw new BadRequestException("utilisateur not found")
    }
    const updatedUser = await this.prisma.utilisateur.update({
      where: {
        id: id,
      },
      data: {
        ...updateUserDto
      }
    })
    return updateUserDto
  }

  async remove(id: number, user) {
    if (user.role !== "ADMIN") {
      throw new NotFoundException("you don't have the right to access this resource")
    }
    const checkUser = await this.prisma.utilisateur.findFirst({
      where: {
        id: id
      },
      include: {
        emprunts: {
          where: {
            statut: {
              in: ['EN_COURS', 'EN_RETARD', 'EN_ATTENTE_RETOUR']
            }
          }
        }
      }
    })

    if (!checkUser) {
      throw new BadRequestException("user not found")
    }

    // Vérifier s'il y a des emprunts actifs
    if (user.emprunts.length > 0) {
      throw new BadRequestException(
        `Cannot delete user: ${user.emprunts.length} active loan(s) found. Please return all books first.`
      )
    }

    // Supprimer toutes les données liées avant de supprimer l'utilisateur
    await this.prisma.$transaction(async (prisma) => {
      // Supprimer l'historique des points
      await prisma.historiquePoints.deleteMany({
        where: { utilisateurId: id }
      })

      // Supprimer les bonus possédés
      await prisma.bonusPossede.deleteMany({
        where: { utilisateurId: id }
      })

      // Supprimer les badges obtenus
      await prisma.badgeEtudiant.deleteMany({
        where: { utilisateurId: id }
      })

      // Supprimer les sanctions
      await prisma.sanction.deleteMany({
        where: { utilisateurId: id }
      })

      // Supprimer la liste de souhaits
      await prisma.listeSouhaits.deleteMany({
        where: { utilisateurId: id }
      })

      // Supprimer les emprunts terminés (RETOURNE)
      await prisma.emprunt.deleteMany({
        where: {
          utilisateurId: id,
          statut: 'RETOURNE'
        }
      })

      // Enfin, supprimer l'utilisateur
      await prisma.utilisateur.delete({
        where: { id: id }
      })
    })

    return { message: "User successfully deleted", user };
  }

  async changePaassword(password, id, user) {
    const checkUser = await this.prisma.utilisateur.findFirst({
      where: {
        id: id
      }
    })
    if (!checkUser) {
      throw new BadRequestException('user not found')
    }
    if (user.id !== id) {
      throw new BadRequestException('you don\'t have the right to access this resource')
    }
    const hashedPassword = await bcrypt.hash(password.motDePasse, 10)
    const updatedUser = await this.prisma.utilisateur.update({
      where: {
        id: id
      },
      data: {
        motDePasse: hashedPassword
      }
    })



    const { motDePasse, ...safeUser } = updatedUser;

    return safeUser
  }
  async getTopStudents() {
  return await this.prisma.utilisateur.findMany({
    where: {
      role: 'ETUDIANT', 
    },
    select: {
      id: true,
      nom: true,
      xp: true,
      niveau: true,
      
    },
    orderBy: {
      xp: 'desc',
    },
    take: 5,
  });
}
}

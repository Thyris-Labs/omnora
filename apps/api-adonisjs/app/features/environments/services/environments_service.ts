import User from "#features/users/models/user";
import { MultipartFile } from "@adonisjs/core/bodyparser";
import Environment from "../models/environment.ts";
import { inject } from "@adonisjs/core";
import SaveAvatarImageAction, { SaveAvatarError } from "../actions/save_avatar_image.ts";
import { isErr, Result } from "#shared/errors";

type CreateEnvironmentError = SaveAvatarError

@inject()
export default class EnvironmentsService {
  constructor(private readonly optimizeAvatarImage: SaveAvatarImageAction) { }

  async createEnvironment({ caller, name, avatar }: { caller: User, name: string, avatar: MultipartFile }): Promise<Result<Environment, CreateEnvironmentError>> {
    const res = await this.optimizeAvatarImage.execute(avatar)
    if (isErr(res)) return res

    const environment = await Environment.create({
      id: crypto.randomUUID(),
      name: name,
      avatar: res,
      ownerId: caller.id
    })

    return environment
  }
}

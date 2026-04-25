import User from "#features/users/models/user"
import UserTransformer from "#features/users/transformers/user_transformer"
import { HttpContext } from "@adonisjs/core/http"
import { signupValidator } from "#features/users/validators/auth_validator"

export default class AuthController {
  async store({ request, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)

    const user = await User.create({ fullName, email, password })
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }
}

export interface User {
  id: string
  nome: string
  contacto: string
  contactoTipo: "email" | "telefone"
  senha: string
  criadoEm: string
  ultimoAcesso?: string
}

export interface UserSession {
  id: string
  nome: string
  contacto: string
  contactoTipo: "email" | "telefone"
}

// Simulated database using localStorage
export class AuthService {
  private static USERS_KEY = "apoio_emocional_users"
  private static SESSION_KEY = "apoio_emocional_session"

  static getAllUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  static async register(userData: {
    nome: string
    contacto: string
    contactoTipo: "email" | "telefone"
    senha: string
  }): Promise<{ success: boolean; message: string; user?: UserSession }> {
    const users = this.getAllUsers()

    // Check if user already exists
    const existingUser = users.find((u) => u.contacto === userData.contacto)
    if (existingUser) {
      return { success: false, message: "Já existe uma conta com este contacto" }
    }

    // Create new user
    const newUser: User = {
      id: this.generateId(),
      nome: userData.nome,
      contacto: userData.contacto,
      contactoTipo: userData.contactoTipo,
      senha: userData.senha, // In real app, this would be hashed
      criadoEm: new Date().toISOString(),
      ultimoAcesso: new Date().toISOString(),
    }

    users.push(newUser)
    this.saveUsers(users)

    // Create session
    const session: UserSession = {
      id: newUser.id,
      nome: newUser.nome,
      contacto: newUser.contacto,
      contactoTipo: newUser.contactoTipo,
    }

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))

    return { success: true, message: "Conta criada com sucesso", user: session }
  }

  static async login(
    contacto: string,
    senha: string,
  ): Promise<{ success: boolean; message: string; user?: UserSession }> {
    const users = this.getAllUsers()
    const user = users.find((u) => u.contacto === contacto && u.senha === senha)

    if (!user) {
      return { success: false, message: "Contacto ou senha incorretos" }
    }

    // Update last access
    user.ultimoAcesso = new Date().toISOString()
    this.saveUsers(users)

    // Create session
    const session: UserSession = {
      id: user.id,
      nome: user.nome,
      contacto: user.contacto,
      contactoTipo: user.contactoTipo,
    }

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))

    return { success: true, message: "Login realizado com sucesso", user: session }
  }

  static getCurrentUser(): UserSession | null {
    const session = localStorage.getItem(this.SESSION_KEY)
    return session ? JSON.parse(session) : null
  }

  static logout(): void {
    localStorage.removeItem(this.SESSION_KEY)
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

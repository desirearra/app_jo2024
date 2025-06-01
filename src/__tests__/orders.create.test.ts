import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import request from "supertest";
import app from "../app";
import { prisma } from "../utils/prisma";

// Helpers pour setup
async function createTestUser() {
  return prisma.user.create({
    data: {
      email: "orderuser@example.com",
      password: await bcrypt.hash("order_1234", 10),
      firstName: "Order",
      lastName: "User",
      role: UserRole.USER,
      key1: "clé-mockée-order",
    },
  });
}

async function createOffers() {
  const offer1 = await prisma.offer.create({
    data: {
      name: "Pass Duo",
      description: "Billet duo",
      price: 200,
      type: "DUO",
      seats: 10,
      places: 2,
    },
  });
  const offer2 = await prisma.offer.create({
    data: {
      name: "Pass Familial",
      description: "Billet famille",
      price: 500,
      type: "FAMILY",
      seats: 5,
      places: 4,
    },
  });
  return [offer1, offer2];
}

describe("POST /api/orders", () => {
  let user: any;
  let offers: any[];

  beforeAll(async () => {
    await prisma.ticket.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.user.deleteMany({ where: { email: "orderuser@example.com" } });
    user = await createTestUser();
    offers = await createOffers();
  });

  afterAll(async () => {
    await prisma.ticket.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.user.deleteMany({ where: { email: "orderuser@example.com" } });
    await prisma.$disconnect();
  });

  it("crée une commande multi-items et génère les tickets liés", async () => {
    // Simule un login (à adapter selon ton auth)
    const token = "mocked-jwt-for-user"; // À remplacer par un vrai JWT si besoin

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [
          { offerId: offers[0].id, quantity: 2 }, // 2 Pass Duo
          { offerId: offers[1].id, quantity: 1 }, // 1 Pass Familial
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.orderItems).toHaveLength(2);
    // Vérifie les tickets générés
    const tickets = res.body.orderItems.flatMap((item: any) => item.tickets);
    expect(tickets).toHaveLength(3); // 2 Duo + 1 Familial
    expect(tickets[0]).toHaveProperty("places");
    expect(tickets[1]).toHaveProperty("places");
    expect(tickets[2]).toHaveProperty("places");
    // Vérifie le user lié
    expect(res.body.userId).toBe(user.id);
  });
});

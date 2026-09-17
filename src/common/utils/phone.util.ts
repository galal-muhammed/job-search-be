import { Model } from "mongoose";

export async function checkPhone<T>(
  phone: string,
  model: Model<T>,
): Promise<boolean> {
  const user = await model.findOne({ phone } as any).exec();
  return !!user;
}
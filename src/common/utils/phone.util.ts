import { Model } from "mongoose";

export async function checkPhone<T>(
  mobileNumber: string,
  model: Model<T>,
): Promise<boolean> {
  const user = await model.findOne({ mobileNumber } as any).exec();
  return !!user;
}
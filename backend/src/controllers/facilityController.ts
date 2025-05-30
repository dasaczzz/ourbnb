import { Request, Response } from "express";
import facilityService from "../service/facilityService";

const facilityController = {
  getFacilitiesByPostId: async (req: Request, res: Response) => {
    try {
      const { post_id } = req.params;
      
      if (!post_id) {
        res.status(400).json({ message: "se requiere el id del post" });
        return;
      }

      const facilities = await facilityService.getFacilitiesByPostId(post_id);
      
      if (!facilities) {
        res.status(404).json({ message: "La publicacion no tiene facilidades" });
        return;
      }

      res.status(200).json(facilities);
    } catch (error) {
      console.error("Error obteniendo facilidades por post Id:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default facilityController; 
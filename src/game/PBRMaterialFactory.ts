import {PBRMaterial, Scene, Texture} from "@babylonjs/core";
const basecolorTxr2 = require("../textures/Metal_Plate_041_basecolor2.jpg");
const normalDisplacementTxr2 = require("../textures/Metal_Plate_041_NRM_DSP.png");
const metallicRoughnessAoTxr2 = require("../textures/Metal_Plate_041_OCC_ROUGH_METAL.jpg");
const basecolorTxr = require("../textures/Metal_Plate_015_basecolor.jpg");
const normalDisplacementTxr = require("../textures/Metal_Plate_015_NRM_DSP.png");
const metallicRoughnessAoTxr = require("../textures/Metal_Plate_015_OCC_ROUGH_METAL.jpg");
const basecolorTxr3 = require("../textures/Mushroom_Top_001_basecolor.jpg");
const normalDisplacementTxr3 = require("../textures/Mushroom_Top_001_NRM_DSP.png");
const metallicRoughnessAoTxr3 = require("../textures/Mushroom_Top_001_OCC_ROUGH_METAL.jpg");


interface IMaterialMap { [key: string]: PBRMaterial }

interface ITextureMap { [key: string]: { [key: string]: Texture } }

interface IPBRMaterialFactoryOptions {
    isDynamic?: boolean,
    pScale?: number,
    uScale?: number,
    vScale?: number,
}

export enum PBREnum {
    Metal_Plate_41,
    Metal_Plate_15,
    Mushroom_Top_001,
}

export default class PBRMaterialFactory {
    private readonly scene: Scene = null

    private materialCache: IMaterialMap = {}

    private textureCache: ITextureMap = {}

    public constructor(scene: Scene) {
        this.scene = scene
    }

    /**
     * Returns the specified PBR texture
     */
    public create = (type: PBREnum, opts: IPBRMaterialFactoryOptions = {}): PBRMaterial => {
        const {
            isDynamic = false,
            pScale = 0.1,
        } = opts
        opts.uScale = opts.uScale || 1
        opts.vScale = opts.vScale || 1
        if (!this.materialCache[type]) {
            const mat = new PBRMaterial(PBREnum[type], this.scene)
            this.setTextures(type, mat, opts)
            mat.useParallax = true
            mat.parallaxScaleBias = pScale
            isDynamic || mat.freeze()
            this.materialCache[type] = mat
        }
        return this.materialCache[type]
    }

    /**
     * Sets the PBR textures of a material (mutative)
     */
    private setTextures = (type: PBREnum, material: PBRMaterial, opts: IPBRMaterialFactoryOptions): void => {
        if (!this.textureCache[type]) {
            let albedoSrc = null, bumpSrc = null, metallicSrc = null
            switch (type) {
                case PBREnum.Metal_Plate_41:
                    albedoSrc = basecolorTxr2
                    bumpSrc = normalDisplacementTxr2
                    metallicSrc = metallicRoughnessAoTxr2
                    break;
                case PBREnum.Mushroom_Top_001:
                    albedoSrc = basecolorTxr3
                    bumpSrc = normalDisplacementTxr3
                    metallicSrc = metallicRoughnessAoTxr3
                    break;
                case PBREnum.Metal_Plate_15:
                default:
                    albedoSrc = basecolorTxr
                    bumpSrc = normalDisplacementTxr
                    metallicSrc = metallicRoughnessAoTxr
                    break;
            }
            this.textureCache[PBREnum[type]] = {
                albedoTexture: new Texture(albedoSrc, this.scene),
                bumpTexture: new Texture(bumpSrc, this.scene),
                metallicTexture: new Texture(metallicSrc, this.scene),
            }
        }
        const { albedoTexture, bumpTexture, metallicTexture }
            = this.textureCache[PBREnum[type]]
        const { uScale = 1, vScale = 1 } = opts
        albedoTexture.uScale = uScale
        albedoTexture.vScale = vScale
        bumpTexture.uScale = uScale
        bumpTexture.vScale = vScale
        metallicTexture.uScale = uScale
        metallicTexture.vScale = vScale
        material.albedoTexture = albedoTexture
        material.bumpTexture = bumpTexture
        material.metallicTexture = metallicTexture
        material.useRoughnessFromMetallicTextureAlpha = false
        material.useMetallnessFromMetallicTextureBlue = true
        material.useRoughnessFromMetallicTextureGreen = true
        material.useAmbientOcclusionFromMetallicTextureRed = true
    }
}

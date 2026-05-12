import { WaylandElementType, WaylandProtocol } from '../model/wayland'

export interface TranslationData {
    description?: {
        summary?: string
        text?: string
    }
    interfaces?: {
        [interfaceName: string]: {
            description?: {
                summary?: string
                text?: string
            }
            requests?: {
                [name: string]: {
                    description?: {
                        summary?: string
                        text?: string
                    }
                }
            }
            events?: {
                [name: string]: {
                    description?: {
                        summary?: string
                        text?: string
                    }
                }
            }
            enums?: {
                [name: string]: {
                    description?: {
                        summary?: string
                        text?: string
                    }
                    entries?: {
                        [name: string]: {
                            summary?: string
                            description?: {
                                summary?: string
                                text?: string
                            }
                        }
                    }
                }
            }
        }
    }
}

export function applyTranslation(
    protocol: WaylandProtocol,
    translation?: TranslationData
): WaylandProtocol {
    if (!translation) return protocol

    // Deep clone to avoid mutating the original require()'d object
    const merged: WaylandProtocol = JSON.parse(JSON.stringify(protocol))

    if (translation.description) {
        merged.description = {
            type: WaylandElementType.Description,
            text: translation.description.text ?? merged.description?.text ?? '',
            summary: translation.description.summary ?? merged.description?.summary,
        }
    }

    if (translation.interfaces && merged.interfaces) {
        merged.interfaces.forEach((inter) => {
            const transInter = translation.interfaces![inter.name]
            if (!transInter) return

            if (transInter.description) {
                inter.description = {
                    type: WaylandElementType.Description,
                    text: transInter.description.text ?? inter.description?.text ?? '',
                    summary: transInter.description.summary ?? inter.description?.summary,
                }
            }

            if (transInter.requests && inter.requests) {
                inter.requests.forEach((req) => {
                    const transReq = transInter.requests![req.name]
                    if (transReq?.description) {
                        req.description = {
                            type: WaylandElementType.Description,
                            text: transReq.description.text ?? req.description?.text ?? '',
                            summary: transReq.description.summary ?? req.description?.summary,
                        }
                    }
                })
            }

            if (transInter.events && inter.events) {
                inter.events.forEach((ev) => {
                    const transEv = transInter.events![ev.name]
                    if (transEv?.description) {
                        ev.description = {
                            type: WaylandElementType.Description,
                            text: transEv.description.text ?? ev.description?.text ?? '',
                            summary: transEv.description.summary ?? ev.description?.summary,
                        }
                    }
                })
            }

            if (transInter.enums && inter.enums) {
                inter.enums.forEach((en) => {
                    const transEn = transInter.enums![en.name]
                    if (!transEn) return

                    if (transEn.description) {
                        en.description = {
                            type: WaylandElementType.Description,
                            text: transEn.description.text ?? en.description?.text ?? '',
                            summary: transEn.description.summary ?? en.description?.summary,
                        }
                    }

                    if (transEn.entries && en.entries) {
                        en.entries.forEach((entry) => {
                            const transEntry = transEn.entries![entry.name]
                            if (transEntry) {
                                if (transEntry.summary) {
                                    entry.summary = transEntry.summary
                                }
                                if (transEntry.description) {
                                    entry.description = {
                                        type: WaylandElementType.Description,
                                        text: transEntry.description.text ?? entry.description?.text ?? '',
                                        summary: transEntry.description.summary ?? entry.description?.summary,
                                    }
                                }
                            }
                        })
                    }
                })
            }
        })
    }

    return merged
}

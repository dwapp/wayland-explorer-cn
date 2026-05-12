import React from 'react'
import { WaylandDataTable } from './WaylandDataTable'
import { WaylandDescription } from './WaylandDescription'
import { WaylandElementProps, WaylandEventModel } from './common'
import { WaylandColorTheme as colors } from './common/wayland-protocol-icons'
import { Badge } from './content/Badge'
import { WaylandElementSignature } from './content/WaylandElementSignature'
import { i18n } from '../lib/i18n-labels'
import { useLanguage } from '../lib/LanguageContext'

export const WaylandEvent: React.FC<
    WaylandElementProps<WaylandEventModel> & { interfaceName: string }
> = ({ element, interfaceName }) => {
    const { language } = useLanguage()
    const labels = i18n[language]

    return (
        <div>
            <div className="flex items-center flex-wrap justify-between">
                <a
                    id={`${interfaceName}:${element.type}:${element.name}`}
                    href={`#${interfaceName}:${element.type}:${element.name}`}
                    title={`${element.name} event`}
                    className={`${colors.Event} text-xl font-bold flex items-center`}
                >
                    <span className="codicon codicon-symbol-event mr-1"></span>
                    <span className="mr-1">
                        <span className={`hidden md:inline ${colors.Interface}`}>
                            {interfaceName}::
                        </span>
                        <span>{element.name}</span>
                    </span>
                </a>
                {(element.eventType || element.since || element.deprecatedSince) && (
                    <div className="flex items-center gap-1">
                        {element.deprecatedSince && (
                            <Badge
                                bgColor="bg-red-500"
                                textColor="text-white"
                                fontWeigth="font-bold"
                            >
                                {labels.deprecatedSince} {element.deprecatedSince}
                            </Badge>
                        )}
                        {element.eventType && (
                            <Badge bgColor="bg-pink-100" textColor="text-pink-800">
                                {labels.type}: {element.eventType}
                            </Badge>
                        )}
                        {element.since && <Badge>{labels.since} {element.since}</Badge>}
                    </div>
                )}
            </div>

            <WaylandElementSignature
                element={element}
                interfaceName={interfaceName}
            />

            {!!element.args?.length && (
                <WaylandDataTable
                    elements={element.args}
                    parentElement={element}
                    interfaceName={interfaceName}
                />
            )}

            {element.description && (
                <WaylandDescription element={element.description} />
            )}
        </div>
    )
}

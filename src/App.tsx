import { useRoute } from 'wouter'
import { useAnalytics } from './analytics/plausible'
import { MultiColumnLayout } from './components/layout/MultiColumnLayout'
import { WaylandProtocolOutline } from './components/outline/WaylandProtocolOutline'
import { WaylandProtocol } from './components/WaylandProtocol'
import { waylandProtocolRegistry } from './data/protocol-registry'
import { NotFound } from './pages/404'
import { Homepage } from './pages/Homepage'
import { GitLab, GitLabMrList } from './pages/GitLab'
import { useLanguage } from './lib/LanguageContext'
import { applyTranslation } from './lib/i18n'

function App() {
    const { language } = useLanguage()
    let contentView = <Homepage />
    let outlineView = null

    const [isGitlabMrList] = useRoute<{ iid: string }>('/wayland-protocols')
    const [isGitlab, gitlabParams] = useRoute<{ iid: string }>(
        '/wayland-protocols/:iid'
    )

    const [match, params] = useRoute<{ protocolId: string }>('/:protocolId')
    const isHomepage = !match && !isGitlab

    useAnalytics().trackPageview()

    if (isGitlabMrList) {
        return <GitLabMrList />
    } else if (isGitlab && gitlabParams?.iid) {
        return <GitLab iid={gitlabParams?.iid}></GitLab>
    } else if (match && params?.protocolId) {
        const protocolRegistryItem = waylandProtocolRegistry.protocols.find(
            (p) => p.id === params.protocolId
        )

        if (protocolRegistryItem) {
            const { protocol: rawProtocol, translations, ...metadata } = protocolRegistryItem
            const translatedProtocol =
                language === 'zh' && translations?.['zh-CN']
                    ? applyTranslation(rawProtocol, translations['zh-CN'])
                    : rawProtocol

            contentView = (
                <WaylandProtocol
                    element={translatedProtocol}
                    metadata={metadata}
                />
            )
            outlineView = (
                <WaylandProtocolOutline element={translatedProtocol} />
            )
        } else {
            contentView = <NotFound />
        }
    }

    return (
        <MultiColumnLayout outlineView={outlineView} hideSidebar={isHomepage}>
            {contentView}
        </MultiColumnLayout>
    )
}

export default App

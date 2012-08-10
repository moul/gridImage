(($, window, console) ->
        pluginName = 'gridImage'
        document = window.document
        log = () -> console.log.apply console, arguments

        defaults =
                width: 30
                height: 30
                left: 10
                top: 10
                right: 10
                bottom: 10
                backgroundColor: 'rgba(255, 0, 0, 0.05)' # transparent
                gridColor: 'white'
                container: $('body')
                updateOrigin: false # not yet working
                properties: ['-webkit-linear-gradient', '-moz-linear-gradient', '-o-linear-gradient', '-ms-linear-gradient', 'linear-gradient']

        class Plugin
                constructor: (options) ->
                        @options = $.extend {}, defaults, options
                        if @options.container.is("img")
                                @options.container.load =>
                                        @update()
                        else
                                @update()

                initGradients: =>
                        @gradients = []
                        @gradients.push "top,  transparent #{@options.height - 1}px, #{@options.gridColor} #{@options.height}px"
                        @gradients.push "left, transparent #{@options.width  - 1}px, #{@options.gridColor} #{@options.width}px"

                build: =>
                        @width = @options.container.width()
                        @height = @options.container.height()
                        if @options.updateOrigin
                                @imgSrc = @options.container.attr 'src'
                                @grid = $('<div></div>').css
                                                width: @width
                                                height: @height
                                                backgroundImage: "url(#{@imgSrc})"
                                @options.container.replaceWith @grid
                        else
                                @grid = $('<div></div>')
                                @grid.css 'position', 'absolute'
                                @options.container.after @grid

                update: =>
                        if not @grid #first time
                                @build()

                        if not @options.updateOrigin
                                containerPosition = @options.container.position()
                                @grid.css
                                        top: containerPosition.top + parseInt(@options.top)
                                        left: containerPosition.left + parseInt(@options.left)
                                        width: @width - parseInt(@options.left) - parseInt(@options.right)
                                        height: @height - parseInt(@options.top) - parseInt(@options.bottom)
                                        backgroundColor: @options.backgroundColor
                        @grid.css
                                backgroundSize: "#{@options.width}px #{@options.height}px"

                        @initGradients()
                        for property in @options.properties
                                compiledGradient = ("#{property}(#{gradient})" for gradient in @gradients).join(', ')
                                #if @options.updateOrigin
                                #        compiledGradient = "url(#{imgSrc}), #{compiledGradient}"
                                @grid.css 'background-image', compiledGradient

        $.fn[pluginName] = (options) ->
                if options == 'getObject'
                        return this.data "plugin_#{pluginName}"
                return @each ->
                        if !$.data this, "plugin_#{pluginName}"
                                options =
                                        container: $(this)
                                newPlugin = new Plugin options
                                $.data @, "plugin_#{pluginName}", newPlugin
                        return $.data @, "plugin_#{pluginName}"

        $(document).ready ->
                $('[rel="#{pluginName}"]').each ->
                        options =
                                container: $(@)
                        $.fn[pluginName].call(options)

)(jQuery, window, console)